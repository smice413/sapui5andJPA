package com.example.demo.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.ComSubCdEntity;
import com.example.demo.entity.SubEntity;
import com.example.demo.entity.TestEntity;
import com.example.demo.service.TestService;
import com.example.demo.service.TestServiceImpl;


@RestController
@RequestMapping("/")
public class TestController {

	@Autowired
	TestService ts;

	@RequestMapping(value = "/save", method = RequestMethod.POST)
	public TestEntity insertCol(@RequestBody TestEntity te) {
		System.out.println("te");
		return ts.insertCol(te);
	}

	@RequestMapping(value = "/findAll", method = RequestMethod.POST)
	public List<TestEntity> selectAll() {
		List<TestEntity> list = ts.selectAll();

		return list;
	}
//	@RequestMapping(value= "/findBy", method= RequestMethod.POST)
//	public Optional<TestEntity> selectOne(@RequestBody String col1) {
//		System.out.println("find에 왔다");
//		Optional<TestEntity> opte = ts.selectOne(col1);
//		
//		return opte;
//	}

	@RequestMapping(value = "/delete", method = RequestMethod.POST)
	public int del(@RequestBody TestEntity te) {
		System.out.println("delete에 왔다.");

		return ts.del(te);
	}

	@RequestMapping(value = "/search", method = RequestMethod.POST)
	public List<TestEntity> search(@RequestBody TestEntity te) {
		System.out.println("search에 왔다");
		String col1 = te.getCol1();
		String col2 = te.getCol2();
		System.out.println(col1);
		System.out.println(col2);

//		List<TestEntity> list = new ArrayList<TestEntity>();
//		if (col1 == "" && col2 != "") {
//			list = ts.searchcol2(col2);
//		} else if (col1 != "" && col2 == "") {
//			list = ts.searchcol1(col1);
//		} else if (col1 != "" && col2 != "") {
//			list = ts.searchall(col1, col2);
//		} else if (col1 == "" && col2 == "") {
//			return list;
//		}

		List<TestEntity> list = ts.search(col1, col2);
		return list;
	}

// sub1을 네이티브 쿼리로 뽑기	
//	@RequestMapping(value = "/findBySub1", method = RequestMethod.POST)
//	public ArrayList<String> findBySub1() {
//		System.out.println("findBySub1에 왔다.");
//		ArrayList<String> list = new ArrayList<String>();
//		list = ts.findBySub1();
//
//		for (int i = 0; i < list.size(); i++) {
//
//			System.out.println(list.get(i));
//		}
//
//		return list;
//	}

	
// sub1을 JPA함수로 뽑기(JSON값으로 받아옴) 	
//	@RequestMapping(value = "findBySub1", method = RequestMethod.POST)
//	public List<SubEntity> findall() {
//		List<SubEntity> list = ts.findall();
//		return list;
//	}
	
// ComSubCdEntity로 연결하여 key valuer값쓸 공통코드 뽑기
	@RequestMapping(value = "findBySub1" , method = RequestMethod.POST)
	public List<ComSubCdEntity> findallSubCd(){
		return ts.findallSubCd();
	}
	

}
