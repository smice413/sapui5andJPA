package com.example.demo.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entity.ComSubCdEntity;
import com.example.demo.entity.SubEntity;
import com.example.demo.entity.TestEntity;
import com.example.demo.repository.ComSubCdRepository;
import com.example.demo.repository.SubRepository;
import com.example.demo.repository.TestRepository;

@Service
public class TestServiceImpl implements TestService {
	
	@Autowired TestRepository tr;
	@Autowired SubRepository sr;
	@Autowired ComSubCdRepository cscr;
	
	@Override
	public TestEntity insertCol(TestEntity te) {
			
		return tr.save(te);
	}

	@Override
	public List<TestEntity> selectAll() {
		
		return tr.findAll();
		
	}

//	@Override
//	public Optional<TestEntity> selectOne(String col1) {
//		
//		return tr.findById(col1);
//	}

	@Override
	public int del(TestEntity te) {
		int result = 0;
		if(te != null) {
			tr.delete(te);
			result = 1;
			
		}else if(te == null) {
			result = 0;
			
			
		}
		System.out.println("delete result값="+result);
		return result;
	}

	/*
	 * @Override public List<TestEntity> searchcol2(String col2) { // TODO
	 * Auto-generated method stub List<TestEntity> underbarEx =
	 * tr.findByCol1AndSubEntity_sub2(col2,col2); //col1으로 접근해서 sub2의 엔티티에 접근하는 법
	 * return tr.findAllcol2(col2); }
	 * 
	 * @Override public List<TestEntity> searchcol1(String col1) { // TODO
	 * Auto-generated method stub return tr.findAllcol1(col1); }
	 * 
	 * @Override public List<TestEntity> searchall(String col1, String col2) {
	 * //return tr.findAll(col1, col2); return tr.findAll(col1, col2); }
	 */

	
	
//	@Override
//	public ArrayList<String> findBySub1() {
//		// TODO Auto-generated method stub
//		return tr.findBySub1();
//	}
	

	@Override
	public List<TestEntity> search(String col1, String col2) {
		// TODO Auto-generated method stub
		return tr.findByCol1ContainingAndCol2Containing(col1, col2);
	}

	@Override
	public List<ComSubCdEntity> findallSubCd() {
		// TODO Auto-generated method stub
		return cscr.findAll();
	}

//	@Override
//	public List<SubEntity> findall() {
//		// TODO Auto-generated method stub
//		return sr.findAll();
//	}

	

	
	
	
	
	
}
