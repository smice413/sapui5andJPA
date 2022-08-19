package com.example.demo.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name= "table_5" )
public class TestEntity{


@Id @Column(name="col1", nullable = false) 		private String col1;
	@Column(name="col2") 						private String col2;
	@Column(name="col3")				    	private String col3;
												
@ManyToOne
@NotFound(action=NotFoundAction.IGNORE)	
@JoinColumn(name="col3", insertable=false, updatable=false)
private SubEntity subEntity;

}
